package com.fitness.programtracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ProgramRequestDTO {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @NotEmpty(message = "At least one level must be specified")
    private List<String> levels;
    
    @NotEmpty(message = "At least one goal must be specified")
    private List<String> goals;
    
    @NotBlank(message = "Equipment type is required")
    private String equipment;
    
    @NotNull(message = "Program length is required")
    @Positive(message = "Program length must be positive")
    private Double programLength;
    
    @NotNull(message = "Time per workout is required")
    @Positive(message = "Time per workout must be positive")
    @Max(value = 300, message = "Time per workout cannot exceed 300 minutes")
    private Double timePerWorkout;
    
    @NotNull(message = "Total exercises is required")
    @Positive(message = "Total exercises must be positive")
    private Integer totalExercises;
}
