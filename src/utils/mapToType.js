/**
 * Maps object classes to their static type parameters
 * @params {class} classes - list of object classes (nodes or edges)
 * @returns {{[string]: class}}
 */
export default function mapToType(classes) {
  const classMap = {};
  for (let cls of classes) {
    classMap[cls.type] = cls;
  }
  return classMap;
}