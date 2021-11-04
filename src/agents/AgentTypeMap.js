import Traveler from "./Traveler";
import PathTraveler from './PathTraveler';
import { mapToType } from "../utils";

/**
 * Maps edges to their types for factory
 */
export default mapToType([
  Traveler,
  PathTraveler,
]);