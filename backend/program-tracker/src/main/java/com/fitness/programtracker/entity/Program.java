package com.fitness.programtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "fitness_programs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Program {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    private String title;
    
    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Description is required")
    private String description;
    
    @Column(name = "level")
    private String level;
    
    @Column(name = "goal")
    private String goal;
    
    private String equipment;
    
    @Column(name = "program_length")
    @NotNull(message = "Program length is required")
    @Positive(message = "Program length must be positive")
    private Double programLength;
    
    @Column(name = "time_per_workout")
    @NotNull(message = "Time per workout is required")
    @Positive(message = "Time per workout must be positive")
    private Double timePerWorkout;
    
    @Column(name = "total_exercises")
    @NotNull(message = "Total exercises is required")
    @Positive(message = "Total exercises must be positive")
    private Integer totalExercises;
    
    // YENİ: User ilişkisi - Her programın bir sahibi var
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // Nullable - eski veriler için
    private User createdBy;
    
    @Column(name = "created")
    private LocalDateTime createdAt;
    
    @Column(name = "last_edit")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper method - Program sahibi mi kontrol et
    public boolean isOwnedBy(User user) {
        return createdBy != null && user != null && 
               createdBy.getId().equals(user.getId());
    }
    
    // Helper method - Public program mi (sahipsiz)
    public boolean isPublic() {
        return createdBy == null;
    }
    
    // Helper method - Creator username getir
    public String getCreatorUsername() {
        return createdBy != null ? createdBy.getUsername() : "Anonymous";
    }
}
