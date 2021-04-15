import React from 'react';
import { Grid, Level, LevelItem } from '@patternfly/react-core';
import './DashboardSection.scss';

export type DashboardSectionProps = {
    /* The title for the section */
    title: string,
    /* JSX for toolbar to be shown on the right hand side. */
    toolbar: React.ReactNode
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ title, toolbar, children }) => {
    return (<>
        <Level>
            <LevelItem>{title}</LevelItem>
            <LevelItem className="dashboard-toolbar-section">{toolbar}</LevelItem>
        </Level>
        <Grid hasGutter>
            {children}
        </Grid>
    </>)
};

export default DashboardSection;