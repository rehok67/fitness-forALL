package com.fitness.programtracker.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProgramResponseDTO {
    private Long id;
    private String title;
    private String description;
    private List<String> levels;
    private List<String> goals;
    private String equipment;
    private Double programLength;
    private Double timePerWorkout;
    private Integer totalExercises;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 🔒 OWNERSHIP BİLGİLERİ
    private Long createdByUserId;      // Program sahibinin ID'si
    private String createdByUsername;  // Program sahibinin kullanıcı adı
    private boolean isPublic;          // Sahipsiz program mi?
    
    // Frontend için helper field'lar
    private String creatorDisplayName; // "John Doe" veya "Anonymous"
}
