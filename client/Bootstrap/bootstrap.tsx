/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {init} from 'i18n';
import ReactDOM from 'react-dom';
import React from 'react';
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "./GraphQLClient";
import {ConfigFeatureFlagProvider, FeatureFlag} from "../Contexts/ConfigFeatureFlag";
import {LoggingProvider} from "../Contexts/Logging";
import {Topics} from "../Panels/Topics";

init(); //Bootstrap i18next support
ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <ConfigFeatureFlagProvider>
            <LoggingProvider>
                <FeatureFlag flag={'client.Pages.PlaceholderHome'}>
                    <Topics/>
                </FeatureFlag>
            </LoggingProvider>
        </ConfigFeatureFlagProvider>
    </ApolloProvider>,
    document.getElementById('root')
);
