package com.fitness.programtracker.controller;

import com.fitness.programtracker.dto.ProgramRequestDTO;
import com.fitness.programtracker.dto.ProgramResponseDTO;
import com.fitness.programtracker.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Program API endpoint'leri
 * Frontend'in kullanacağı REST API'yi sağlar
 */
@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/programs")
public class ProgramController {

    private final ProgramService programService;

    @GetMapping
    public List<ProgramResponseDTO> getAllPrograms() {
        return programService.getAllPrograms();
    }

    @GetMapping("/{id}")
    public ProgramResponseDTO getProgramById(@PathVariable Long id) {
        return programService.getProgramById(id);
    }

    @GetMapping("/search")
    public List<ProgramResponseDTO> searchPrograms(
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String goal,
            @RequestParam(required = false) Double maxDuration) {
        return programService.searchPrograms(equipment, level, goal, maxDuration);
    }

    @PostMapping
    public ProgramResponseDTO createProgram(@Valid @RequestBody ProgramRequestDTO requestDTO) {
        return programService.createProgram(requestDTO);
    }

    @PutMapping("/{id}")
    public ProgramResponseDTO updateProgram(
            @PathVariable Long id,
            @Valid @RequestBody ProgramRequestDTO requestDTO) {
        return programService.updateProgram(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteProgram(@PathVariable Long id) {
        programService.deleteProgram(id);
    }

    // Equipment ve Level aramaları için /search endpoint'ini kullanın
    // Örnek: /api/programs/search?equipment=dumbell
    // veya: /api/programs/search?level=beginner
}
