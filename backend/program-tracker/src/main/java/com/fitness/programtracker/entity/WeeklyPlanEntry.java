package com.fitness.programtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "weekly_plan_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyPlanEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek; // Mon, Tue, Wed, Thu, Fri, Sat, Sun

    @Column(columnDefinition = "TEXT")
    private String content;
}


