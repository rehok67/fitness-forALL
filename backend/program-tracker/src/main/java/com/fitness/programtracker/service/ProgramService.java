package com.fitness.programtracker.service;

import com.fitness.programtracker.dto.ProgramRequestDTO;
import com.fitness.programtracker.dto.ProgramResponseDTO;
import com.fitness.programtracker.entity.Program;
import com.fitness.programtracker.entity.User;
import com.fitness.programtracker.mapper.ProgramMapper;
import com.fitness.programtracker.repository.ProgramRepository;
import com.fitness.programtracker.repository.UserRepository;
import com.fitness.programtracker.specification.ProgramSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/*
 Bir restoran düşünün:

Entity (Malzemeler): Mutfaktaki ham malzemeler
Repository (Depo): Bu malzemelerin depolandığı yer
Service (Şef): Malzemeleri alıp yemeğe dönüştüren şef
Controller (Garson): Müşteriden sipariş alan ve servisi yapan garson
Bu sınıfın amacı:
- Program verileri ile ilgili iş mantığını yönetmek
Repository sadece veriyi getirir/götürür
Controller sadece istek alır/cevap verir
Asıl iş yapan Service katmanıdır.

Service Katmanının Sorumlulukları:

Validasyon (Örn: antrenman süresi makul mü?)
İş Kuralları (Örn: başlangıç seviyesi programlarında max 5 egzersiz olabilir)
Veri Zenginleştirme (Örn: program oluşturulduğunda tarih ekleme)
Veri Dönüşümü (Örn: veritabanı entity'sini API response'una çevirme)
Transaction Yönetimi (Örn: ya hep ya hiç prensibi)
Entity → Repository → Service → Controller
Bu sıralama şundan önemli:

Önce verimiz olmalı (Entity)
Sonra veriye erişimimiz olmalı (Repository)
Sonra veriyi işleyebilmeliyiz (Service)
En son dış dünyaya açmalıyız (Controller)

 */
/**
 * Program Service Katmanı:
 * - İş mantığını içerir
 * - Repository ile Controller arasında köprü görevi görür
 * - Validasyonları yapar
 * - Gerekli dönüşümleri (transformation) gerçekleştirir
 * - OWNERSHIP kontrollerini yapar 🔒
 * 
 * @RequiredArgsConstructor kullanarak constructor injection yapıyoruz
 * @Transactional ile veritabanı işlemlerinin transaction güvenliğini sağlıyoruz
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // Varsayılan olarak read-only
public class ProgramService {

    private final ProgramRepository programRepository;
    private final ProgramMapper programMapper;
    private final UserRepository userRepository;

    /**
     * Tüm programları getirir
     */
    public List<ProgramResponseDTO> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(programMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * ID'ye göre program getirir
     * @throws RuntimeException program bulunamazsa
     */
    public ProgramResponseDTO getProgramById(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + id));
        return programMapper.toDTO(program);
    }

    /**
     * Dinamik filtreleme ile program arama
     * Specification pattern kullanarak esnek arama sağlar
     */
    public List<ProgramResponseDTO> searchPrograms(String equipment, String level, 
                                      String goal, Double maxDuration) {
        Specification<Program> spec = Specification.where(null);

        if (equipment != null) {
            spec = spec.and(ProgramSpecifications.hasEquipment(equipment));
        }
        if (level != null) {
            spec = spec.and(ProgramSpecifications.hasLevel(level));
        }
        if (goal != null) {
            spec = spec.and(ProgramSpecifications.hasGoal(goal));
        }
        if (maxDuration != null) {
            spec = spec.and(ProgramSpecifications.maxDuration(maxDuration));
        }

        return programRepository.findAll(spec).stream()
                .map(programMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Yeni program oluşturur - SADECE AUTHENTICATED USER'LAR 🔒
     * Program otomatik olarak current user'a ait olur
     */
    @Transactional
    public ProgramResponseDTO createProgram(ProgramRequestDTO requestDTO) {
        // Current authenticated user'ı al
        User currentUser = getCurrentUser();
        
        // Program entity oluştur
        Program program = programMapper.toEntity(requestDTO);
        
        // Program'ı current user'a ata 🔒
        program.setCreatedBy(currentUser);
        
        // Kaydet ve döndür
        Program savedProgram = programRepository.save(program);
        return programMapper.toDTO(savedProgram);
    }

    /**
     * Mevcut programı günceller - SADECE SAHİBİ VEYA ADMIN 🔒
     * @throws RuntimeException program bulunamazsa veya yetki yoksa
     */
    @Transactional
    public ProgramResponseDTO updateProgram(Long id, ProgramRequestDTO requestDTO) {
        User currentUser = getCurrentUser();
        
        Program existingProgram = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + id));
        
        // OWNERSHIP KONTROLÜ 🔒
        if (!canModifyProgram(existingProgram, currentUser)) {
            throw new RuntimeException("You don't have permission to modify this program. Only the owner or admin can edit programs.");
        }
        
        // Entity güncellemesi için mapper kullan
        Program updatedData = programMapper.toEntity(requestDTO);
        existingProgram.setTitle(updatedData.getTitle());
        existingProgram.setDescription(updatedData.getDescription());
        existingProgram.setLevel(updatedData.getLevel());
        existingProgram.setGoal(updatedData.getGoal());
        existingProgram.setEquipment(updatedData.getEquipment());
        existingProgram.setProgramLength(updatedData.getProgramLength());
        existingProgram.setTimePerWorkout(updatedData.getTimePerWorkout());
        existingProgram.setTotalExercises(updatedData.getTotalExercises());

        Program updatedProgram = programRepository.save(existingProgram);
        return programMapper.toDTO(updatedProgram);
    }

    /**
     * Programı siler - SADECE SAHİBİ VEYA ADMIN 🔒
     * @throws RuntimeException program bulunamazsa veya yetki yoksa
     */
    @Transactional
    public void deleteProgram(Long id) {
        User currentUser = getCurrentUser();
        
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + id));
        
        // OWNERSHIP KONTROLÜ 🔒
        if (!canModifyProgram(program, currentUser)) {
            throw new RuntimeException("You don't have permission to delete this program. Only the owner or admin can delete programs.");
        }
        
        programRepository.delete(program);
    }
    
    /**
     * Current authenticated user'ı al
     * @throws RuntimeException authentication yoksa
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || 
            "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("User not authenticated");
        }
        
        // Principal'dan email al (UserDetailsService'te email'i username olarak kullanıyoruz)
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found: " + email));
    }
    
    /**
     * User'ın program'ı modify edip edemeyeceğini kontrol et
     * Kurallar:
     * 1. Program sahibi ✅
     * 2. Admin kullanıcısı ✅  
     * 3. Public program (sahipsiz) - sadece admin ✅
     */
    private boolean canModifyProgram(Program program, User user) {
        // Admin her şeyi yapabilir
        if (user.getRole() == User.Role.ADMIN) {
            return true;
        }
        
        // Program sahibi yapabilir
        if (program.isOwnedBy(user)) {
            return true;
        }
        
        // Diğer durumlar: yasak
        return false;
    }
    
    /**
     * User'ın program'ı view edip edemeyeceğini kontrol et
     * Şu anda tüm programlar public - ileride private program feature eklenebilir
     */
    private boolean canViewProgram(Program program, User user) {
        // Şimdilik tüm programlar herkes tarafından görülebilir
        return true;
    }
}
