export interface PointsLevels {
  levelName: string;
  levelMin: number;
  levelMax: number;
}

export interface PointTypes {
  pointTypeName: string;
  pointAmount: number;
}

export interface GetUserPoint {
  activityModel: {
    activityName: string;
    activityID: number;
  };
  pointTypeID: number;
  createdDate: string;
  pointTypeModel:{
    pointTypeName: string,
    pointAmount: number
  }
}
