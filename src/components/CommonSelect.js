import { Select } from 'antd';
import PropTypes from 'prop-types';

const CommonSelect = ({
  mode,
  options = [],
  value,
  showSearch = false,
  open = mode === 'tags' ? false : undefined,
  showArrow = mode === 'tags' ? false : true,
  tokenSeparators = mode === 'tags' ? [','] : undefined,
  ...props
}) => {
  // Safeguard against invalid options
  const validatedOptions = Array.isArray(options) ? options.filter((opt) => opt && opt.value && opt.label) : [];

  // Transform string value to match options
  const validatedValue = typeof value === 'string' ? validatedOptions.find((opt) => opt.value === value)?.value : value;

  return (
    <Select
      className="common-select"
      mode={mode}
      options={validatedOptions}
      value={validatedValue}
      showSearch={showSearch}
      open={open}
      showArrow={showArrow}
      tokenSeparators={tokenSeparators}
      {...props}
    />
  );
};

CommonSelect.propTypes = {
  mode: PropTypes.oneOf(['tags', 'multiple']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
    }),
  ),
  value: PropTypes.any,
};

export default CommonSelect;
