package com.fitness.programtracker.specification;

import com.fitness.programtracker.entity.Program;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specification Pattern Nedir?
 * - Veritabanı sorgularını dinamik ve modüler bir şekilde oluşturmamızı sağlayan tasarım deseni
 * - Her bir filtreleme koşulu ayrı bir method olarak tanımlanır
 * - Bu methodlar birleştirilerek karmaşık sorgular oluşturulabilir
 * - Örnek: hasEquipment("Dumbbell").and(hasLevel("Beginner")).and(maxDuration(30.0))
 * 
 * Bu Sınıfın Amacı:
 * Bu sınıf, fitness programları için farklı filtreleme kriterleri tanımlar:
 * - Ekipman tipine göre filtreleme (hasEquipment)
 * - Program seviyesine göre filtreleme (hasLevel)
 * - Program hedefine göre filtreleme (hasGoal)
 * - Maksimum antrenman süresine göre filtreleme (maxDuration)
 * 
 * Kullanım Örneği:
 * ProgramSpecifications.hasEquipment("Full Gym")
 *     .and(ProgramSpecifications.hasLevel("Beginner"))
 *     .and(ProgramSpecifications.maxDuration(60.0))
 */
public class ProgramSpecifications {
    
    public static Specification<Program> hasEquipment(String equipment) {
        return (root, query, cb) -> {
            if (equipment == null) {
                return null;
            }
            return cb.equal(root.get("equipment"), equipment);
        };
    }
    
    public static Specification<Program> hasLevel(String level) {
        return (root, query, cb) -> {
            if (level == null) {
                return null;
            }
            // Case-insensitive arama: "{Beginner,Intermediate,Advanced}" içinde "intermediate"
            return cb.like(
                cb.lower(root.get("level")), 
                "%" + level.toLowerCase() + "%"
            );
        };
    }
    
    public static Specification<Program> hasGoal(String goal) {
        return (root, query, cb) -> {
            if (goal == null) {
                return null;
            }
            // Case-insensitive arama: "{Bodybuilding,Powerlifting}" içinde "bodybuilding"
            return cb.like(
                cb.lower(root.get("goal")), 
                "%" + goal.toLowerCase() + "%"
            );
        };
    }
    
    public static Specification<Program> maxDuration(Double maxDuration) {
        return (root, query, cb) -> {
            if (maxDuration == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get("timePerWorkout"), maxDuration);
        };
    }
}
