package com.fitness.programtracker.mapper;

import com.fitness.programtracker.dto.ProgramRequestDTO;
import com.fitness.programtracker.dto.ProgramResponseDTO;
import com.fitness.programtracker.entity.Program;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProgramMapper {
    
    public Program toEntity(ProgramRequestDTO dto) {
        Program program = new Program();
        program.setTitle(dto.getTitle());
        program.setDescription(dto.getDescription());
        program.setLevel(listToString(dto.getLevels()));
        program.setGoal(listToString(dto.getGoals()));
        program.setEquipment(dto.getEquipment());
        program.setProgramLength(dto.getProgramLength());
        program.setTimePerWorkout(dto.getTimePerWorkout());
        program.setTotalExercises(dto.getTotalExercises());
        return program;
    }
    
    public ProgramResponseDTO toDTO(Program entity) {
        ProgramResponseDTO dto = new ProgramResponseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setLevels(stringToList(entity.getLevel()));
        dto.setGoals(stringToList(entity.getGoal()));
        dto.setEquipment(entity.getEquipment());
        dto.setProgramLength(entity.getProgramLength());
        dto.setTimePerWorkout(entity.getTimePerWorkout());
        dto.setTotalExercises(entity.getTotalExercises());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        // 🔒 OWNERSHIP BİLGİLERİNİ MAP ET
        if (entity.getCreatedBy() != null) {
            dto.setCreatedByUserId(entity.getCreatedBy().getId());
            dto.setCreatedByUsername(entity.getCreatedBy().getUsername());
            dto.setCreatorDisplayName(entity.getCreatedBy().getFullName());
            dto.setPublic(false);
        } else {
            // Sahipsiz (eski) program
            dto.setCreatedByUserId(null);
            dto.setCreatedByUsername(null);
            dto.setCreatorDisplayName("Anonymous");
            dto.setPublic(true);
        }
        
        return dto;
    }
    
    // PostgreSQL array formatından List'e dönüştürme
    // Örnek: "['Intermediate', 'Advanced']" → ["Intermediate", "Advanced"]
    private List<String> stringToList(String arrayString) {
        if (arrayString == null || arrayString.trim().isEmpty()) {
            return List.of();
        }
        
        // Köşeli parantezleri ve tırnakları temizle
        String cleaned = arrayString
            .replace("[", "")
            .replace("]", "")
            .replace("'", "")
            .replace("\"", "");
            
        return Arrays.stream(cleaned.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    }
    
    // List'den PostgreSQL array formatına dönüştürme
    // Örnek: ["Intermediate", "Advanced"] → "['Intermediate', 'Advanced']"
    private String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        
        return "['" + String.join("', '", list) + "']";
    }
}
