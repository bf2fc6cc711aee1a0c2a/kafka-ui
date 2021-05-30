import React, { Component, ErrorInfo, ReactNode } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Title,
  TitleSizes,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";
import "./ErrorBoundary.css";

type Props = WithTranslation &
  RouteComponentProps & {
    children?: ReactNode;
  };

type State = {
  hasError?: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("error:", error, errorInfo);
  }

  onClickButton = () => {
    const { history } = this.props;
    this.setState({ hasError: false });
    history && history.push("/");
  };

  render() {
    const { t } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <PageSection padding={{ default: "noPadding" }}>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h1" size={TitleSizes.lg}>
              {t("common.error_boundary_title")}
            </Title>
            <EmptyStateBody>{t("common.unexpected_error")}</EmptyStateBody>
            <Button
              variant={ButtonVariant.primary}
              onClick={this.onClickButton}
            >
              {t("common.return_to_home")}
            </Button>
          </EmptyState>
        </PageSection>
      );
    }
    return this.props.children;
  }
}

const ErrorBoundaryComponent = withRouter(withTranslation()(ErrorBoundary));
export { ErrorBoundaryComponent as ErrorBoundary };
