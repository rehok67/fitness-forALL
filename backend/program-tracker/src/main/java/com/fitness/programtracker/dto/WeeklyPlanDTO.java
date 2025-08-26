package com.fitness.programtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyPlanDTO {
    private Long programId;
    private List<Entry> entries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Entry {
        private String dayOfWeek; // Mon, Tue, ...
        private String content;
    }
}


