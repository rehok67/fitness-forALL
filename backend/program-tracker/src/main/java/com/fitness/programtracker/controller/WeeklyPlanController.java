package com.fitness.programtracker.controller;

import com.fitness.programtracker.dto.WeeklyPlanDTO;
import com.fitness.programtracker.service.WeeklyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/programs")
public class WeeklyPlanController {

    private final WeeklyPlanService weeklyPlanService;

    @GetMapping("/{programId}/weekly-plan")
    public WeeklyPlanDTO getWeeklyPlan(@PathVariable Long programId) {
        return weeklyPlanService.getWeeklyPlan(programId);
    }
}


