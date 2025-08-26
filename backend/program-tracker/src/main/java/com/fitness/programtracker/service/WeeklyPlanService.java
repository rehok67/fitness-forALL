package com.fitness.programtracker.service;

import com.fitness.programtracker.dto.WeeklyPlanDTO;
import com.fitness.programtracker.entity.Program;
import com.fitness.programtracker.entity.WeeklyPlanEntry;
import com.fitness.programtracker.repository.ProgramRepository;
import com.fitness.programtracker.repository.WeeklyPlanEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyPlanService {

    private final WeeklyPlanEntryRepository weeklyPlanEntryRepository;
    private final ProgramRepository programRepository;

    public WeeklyPlanDTO getWeeklyPlan(Long programId) {
        List<WeeklyPlanEntry> entries = weeklyPlanEntryRepository.findByProgram_IdOrderByIdAsc(programId);
        WeeklyPlanDTO dto = new WeeklyPlanDTO();
        dto.setProgramId(programId);
        dto.setEntries(entries.stream()
                .map(e -> new WeeklyPlanDTO.Entry(e.getDayOfWeek(), e.getContent()))
                .collect(Collectors.toList()));
        return dto;
    }
}


