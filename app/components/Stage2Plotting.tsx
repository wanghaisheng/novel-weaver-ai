

import React from 'react';
import { Stage2Data } from '../types';
import { TextAreaInput } from './common/TextAreaInput';
import { META_PROMPT_SECTIONS } from '../constants';

interface Stage2PlottingProps {
  data: Stage2Data;
  onChange: (updatedData: Stage2Data) => void;
}

const Stage2Plotting: React.FC<Stage2PlottingProps> = ({ data, onChange }) => {
  const sections = META_PROMPT_SECTIONS.stage2;

  const handleChange = <ActKey extends keyof Stage2Data, FieldKey extends keyof Stage2Data[ActKey]>(
    act: ActKey,
    field: FieldKey,
    value: string
  ) => {
    onChange({
      ...data,
      [act]: {
        ...data[act],
        [field]: value,
      },
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <p className="text-md text-foreground leading-relaxed">{sections.intro}</p>
      </div>

      {/* Act I */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-4 tracking-tight">{sections.act1}</h3>
        <TextAreaInput label="Stasis" id="act1_stasis" instruction={sections.stasis} value={data.act1.stasis} onChange={(e) => handleChange('act1', 'stasis', e.target.value)} />
        <TextAreaInput label="Inciting Incident" id="act1_incitingIncident" instruction={sections.incitingIncident} value={data.act1.incitingIncident} onChange={(e) => handleChange('act1', 'incitingIncident', e.target.value)} />
        <TextAreaInput label="Debate" id="act1_debate" instruction={sections.debate} value={data.act1.debate} onChange={(e) => handleChange('act1', 'debate', e.target.value)} />
        <TextAreaInput label="Turning Point 1" id="act1_turningPoint1" instruction={sections.turningPoint1} value={data.act1.turningPoint1} onChange={(e) => handleChange('act1', 'turningPoint1', e.target.value)} />
      </div>

      {/* Act II */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-4 tracking-tight">{sections.act2}</h3>
        <TextAreaInput label="Tests, Allies, and Enemies" id="act2_testsAlliesEnemies" instruction={sections.testsAlliesEnemies} value={data.act2.testsAlliesEnemies} onChange={(e) => handleChange('act2', 'testsAlliesEnemies', e.target.value)} />
        <TextAreaInput label="Midpoint" id="act2_midpoint" instruction={sections.midpoint} value={data.act2.midpoint} onChange={(e) => handleChange('act2', 'midpoint', e.target.value)} />
        <TextAreaInput label="Rising Action / Stakes are Raised" id="act2_risingAction" instruction={sections.risingAction} value={data.act2.risingAction} onChange={(e) => handleChange('act2', 'risingAction', e.target.value)} />
        <TextAreaInput label="All is Lost / Dark Night of the Soul" id="act2_allIsLost" instruction={sections.allIsLost} value={data.act2.allIsLost} onChange={(e) => handleChange('act2', 'allIsLost', e.target.value)} />
        <TextAreaInput label="Turning Point 2" id="act2_turningPoint2" instruction={sections.turningPoint2} value={data.act2.turningPoint2} onChange={(e) => handleChange('act2', 'turningPoint2', e.target.value)} />
      </div>

      {/* Act III */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-4 tracking-tight">{sections.act3}</h3>
        <TextAreaInput label="Run-up to Climax" id="act3_runUpToClimax" instruction={sections.runUpToClimax} value={data.act3.runUpToClimax} onChange={(e) => handleChange('act3', 'runUpToClimax', e.target.value)} />
        <TextAreaInput label="Climax" id="act3_climax" instruction={sections.climax} value={data.act3.climax} onChange={(e) => handleChange('act3', 'climax', e.target.value)} />
        <TextAreaInput label="Falling Action" id="act3_fallingAction" instruction={sections.fallingAction} value={data.act3.fallingAction} onChange={(e) => handleChange('act3', 'fallingAction', e.target.value)} />
        <TextAreaInput label="Resolution & New Stasis" id="act3_resolution" instruction={sections.resolution} value={data.act3.resolution} onChange={(e) => handleChange('act3', 'resolution', e.target.value)} />
      </div>
    </div>
  );
};

export default Stage2Plotting;