import React, {ReactNode} from 'react';
import {GridItem, Card, CardBody} from '@patternfly/react-core';

export type DashboardSectionItemProps = {
}

export const DashboardSectionItem: React.FunctionComponent<DashboardSectionItemProps> = ({ children }) => 
    (
        <GridItem>
            <Card>
                <CardBody>{children}</CardBody>
            </Card>
        </GridItem>);

export default DashboardSectionItem;