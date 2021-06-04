import React, { createContext, useEffect, useState } from "react";
import { AlertVariant } from "@patternfly/react-core";
import { ServerAlertGroup } from "@app/components/ServerAlertGroup";
import { AlertType, AlertContextProps, TimeOut } from "./Alert.types";

export const AlertContext = createContext<AlertContextProps>(
  {} as AlertContextProps
);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [timers, setTimers] = useState<TimeOut[]>([]);

  useEffect(() => {
    const timersKeys = timers.map((timer) => timer?.key);
    const timeOuts = alerts
      .filter((alert) => !timersKeys.includes(alert.key))
      .map((alert) => {
        const timeOut = setTimeout(() => hideAlert(alert.key), 8000);
        return { key: alert.key, timeOut };
      });
    setTimers([...timers, ...timeOuts]);
    return () => timers.forEach((timer) => clearTimeout(timer.timeOut));
  }, [alerts]);

  const hideAlert = (key: number) => {
    setAlerts((alerts) => [...alerts.filter((el) => el.key !== key)]);
    setTimers((timers) => [...timers.filter((timer) => timer.key === key)]);
  };

  const createId = () => new Date().getTime();

  const addAlert = (
    message: string,
    variant: AlertVariant = AlertVariant.default
  ) => {
    setAlerts([...alerts, { key: createId(), message, variant }]);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      <ServerAlertGroup alerts={alerts} onCloseAlert={hideAlert} />
      {children}
    </AlertContext.Provider>
  );
};
