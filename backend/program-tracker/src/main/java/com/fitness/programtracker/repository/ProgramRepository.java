package com.fitness.programtracker.repository;

import com.fitness.programtracker.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
Modern yaklaşım: Specification Pattern kullanımı
- Daha modüler: Her filtre koşulu ayrı yazılır
- Daha maintainable: Yeni filtreler eklemek kolay
- Daha test edilebilir: Her specification ayrı test edilebilir
- Daha okunabilir: Karmaşık JPQL yerine açık kod

JpaSpecificationExecutor sayesinde dinamik sorgular service katmanında oluşturulur
*/

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long>, JpaSpecificationExecutor<Program> {
    
    // Basit, method-name based sorgular - güncel field isimleriyle
    List<Program> findByEquipment(String equipment);
    List<Program> findByTitleContainingIgnoreCase(String title);
    List<Program> findByLevelContaining(String level);
    List<Program> findByGoalContaining(String goal);
    List<Program> findByTimePerWorkoutLessThanEqual(Double maxDuration);
}
