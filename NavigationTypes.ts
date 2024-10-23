import { NavigatorScreenParams } from '@react-navigation/native';

export type ImageInfo = {
  id: string;
  url: string;
  description: string;
  liked: boolean;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Details: { photo: ImageInfo }; 
};

export type RootTabParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  'Log In': undefined;  
};