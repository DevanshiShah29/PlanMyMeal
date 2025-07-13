import { Button } from 'antd';
import { useState } from 'react';

const GenerateWithAIButton = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <Button className="generate-ai-btn" loading={loading} onClick={handleGenerate} size="large">
      <span className="ai-icon">✨</span> Generate with AI
    </Button>
  );
};

export default GenerateWithAIButton;
