import sequelize from '../config/database';
import Reflection from './Reflection';
import SearchHistory from './SearchHistory';

const models = {
  Reflection,
  SearchHistory,
};

export { sequelize, Reflection, SearchHistory };

export default models;
