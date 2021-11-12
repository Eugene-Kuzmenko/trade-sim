import EditorField from './EditorField';
import EditorFieldType from './EditorFieldType';

export default class ShowField extends EditorField {
  static type = EditorFieldType.SHOW;

  constructor({ label, field }) {
    super();
    this.field = field;
    this.label = label;
  }
}