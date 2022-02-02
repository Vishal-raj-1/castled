export enum AppCluster {
  SELECT = "SELECT",
  INDIA = "INDIA",
  US = "US",
}

export const AppClusterLabel: any = {
  [AppCluster.SELECT]: "Select cluster region",
  [AppCluster.INDIA]: "India",
  [AppCluster.US]: "US",
};
