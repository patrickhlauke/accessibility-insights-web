// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mapValues } from 'lodash';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FlaggedComponent } from 'common/components/flagged-component';
import { FeatureFlags } from 'common/feature-flags';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { Switcher, SwitcherDeps } from 'DetailsView/components/switcher';
import { leftNavSwitcherStyleNames } from 'DetailsView/components/switcher-style-names';
import { NamedFC } from '../../../common/react/named-fc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';

export type DetailsViewLeftNavDeps = {
    assessmentsProvider: AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
} & LeftNavDeps &
    SwitcherDeps;

export type DetailsViewLeftNavProps = {
    deps: DetailsViewLeftNavDeps;
    selectedTest: VisualizationType;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
    selectedPivot: DetailsViewPivotType;
};

export const DetailsViewLeftNav = NamedFC<DetailsViewLeftNavProps>('DetailsViewLeftNav', props => {
    const {
        deps,
        selectedTest,
        switcherNavConfiguration,
        rightPanelConfiguration,
        featureFlagStoreData,
        assessmentStoreData,
    } = props;

    const { assessmentsProvider, assessmentsProviderWithFeaturesEnabled } = deps;

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({
        visualizationType: selectedTest,
    });
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );

    const switcher = (
        <Switcher
            deps={props.deps}
            pivotKey={props.selectedPivot}
            styles={leftNavSwitcherStyleNames}
        />
    );

    const leftNav: JSX.Element = (
        <div className="left-nav main-nav">
            <FlaggedComponent
                featureFlag={FeatureFlags[FeatureFlags.reflowUI]}
                featureFlagStoreData={featureFlagStoreData}
                enableJSXElement={switcher}
            />
            <switcherNavConfiguration.LeftNav
                deps={deps}
                assessmentsProvider={filteredProvider}
                selectedKey={selectedKey}
                assessmentsData={mapValues(
                    assessmentStoreData.assessments,
                    data => data.testStepStatus,
                )}
                featureFlagStoreData={featureFlagStoreData}
            />
        </div>
    );

    return leftNav;
});
