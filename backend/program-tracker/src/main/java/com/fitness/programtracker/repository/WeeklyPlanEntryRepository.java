package com.fitness.programtracker.repository;

import com.fitness.programtracker.entity.WeeklyPlanEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyPlanEntryRepository extends JpaRepository<WeeklyPlanEntry, Long> {
    List<WeeklyPlanEntry> findByProgram_IdOrderByIdAsc(Long programId);
}


