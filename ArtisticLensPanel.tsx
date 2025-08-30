/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

// Interfaces for state and props
export interface LensConfig {
    bloom: number;
    chromaticAberration: number;
    scanLines: boolean;
    colorGrading: 'None' | 'Cyberpunk' | 'Vintage' | 'Monochrome';
}

interface ArtisticLensPanelProps {
    config: LensConfig;
    onConfigChange: (newConfig: LensConfig) => void;
}

export const ArtisticLensPanel: React.FC<ArtisticLensPanelProps> = ({ config, onConfigChange }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const isChecked = (e.target as HTMLInputElement).checked;

        onConfigChange({
            ...config,
            [name]: isCheckbox ? isChecked : type === 'range' ? parseFloat(value) : value,
        });
    };

    return (
        <div className="artistic-lens-panel hud-panel">
            <div className="config-item">
                <label htmlFor="bloom">Bloom Intensity: {config.bloom.toFixed(2)}</label>
                <input type="range" id="bloom" name="bloom" min="0" max="1" step="0.05" value={config.bloom} onChange={handleInputChange} />
                <p className="config-description">Adjusts the intensity of the light glow effect on bright areas.</p>
            </div>
            
            <div className="config-item">
                <label htmlFor="chromaticAberration">Chromatic Aberration: {config.chromaticAberration.toFixed(2)}</label>
                <input type="range" id="chromaticAberration" name="chromaticAberration" min="0" max="1" step="0.05" value={config.chromaticAberration} onChange={handleInputChange} />
                <p className="config-description">Simulates lens distortion, creating color fringes on edges.</p>
            </div>

            <div className="config-item-group">
                <div className="config-item">
                    <label htmlFor="colorGrading">Color Grading Preset</label>
                     <div className="config-input-wrapper">
                        <select id="colorGrading" name="colorGrading" value={config.colorGrading} onChange={handleInputChange}>
                            <option value="None">None</option>
                            <option value="Cyberpunk">Cyberpunk</option>
                            <option value="Vintage">Vintage</option>
                            <option value="Monochrome">Monochrome</option>
                        </select>
                    </div>
                    <p className="config-description">Applies a post-processing color filter to the scene.</p>
                </div>
                <div className="config-item checkbox-item">
                    <label htmlFor="scanLines">
                        <input type="checkbox" id="scanLines" name="scanLines" checked={config.scanLines} onChange={handleInputChange} />
                        Enable Scan Lines
                    </label>
                    <p className="config-description">Adds a retro CRT monitor overlay effect.</p>
                </div>
            </div>
        </div>
    );
};