import { useState } from 'react';
import { submitCropData, CropData } from '@/api/api';
import { toast } from '@/hooks/use-toast';
import { Leaf, Send, Calendar, User, FileText, Hash, StickyNote, CheckCircle } from 'lucide-react';

const METRIC_OPTIONS = [
  { value: 'yield', label: 'Yield' },
  { value: 'area', label: 'Area' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'pest', label: 'Pest Level' },
  { value: 'rainfall', label: 'Rainfall' },
];

const DataForm = () => {
  const [formData, setFormData] = useState<CropData>({
    farmer_id: '',
    crop: '',
    event_date: '',
    metric_name: 'yield',
    metric_value: 0,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'metric_value' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.farmer_id.trim()) {
      toast({
        title: 'Missing Farmer ID',
        description: 'Please enter your Farmer ID.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.crop.trim()) {
      toast({
        title: 'Missing Crop Name',
        description: 'Please enter the crop name.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.event_date) {
      toast({
        title: 'Missing Date',
        description: 'Please select an event date.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitCropData(formData);
      toast({
        title: 'Success!',
        description: 'Crop data saved to database successfully.',
      });
      setLastSubmitted(`${formData.crop} - ${formData.metric_name}: ${formData.metric_value}`);
      setFormData({
        farmer_id: formData.farmer_id, // Keep farmer ID for convenience
        crop: '',
        event_date: '',
        metric_name: 'yield',
        metric_value: 0,
        notes: '',
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success indicator */}
      {lastSubmitted && (
        <div className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg border border-success/20 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Last submitted: {lastSubmitted}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farmer ID */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="w-4 h-4 text-primary" />
            Farmer ID <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="farmer_id"
            value={formData.farmer_id}
            onChange={handleChange}
            placeholder="Enter farmer ID (e.g., F001)"
            className="input-field"
            required
          />
        </div>

        {/* Crop */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Leaf className="w-4 h-4 text-primary" />
            Crop Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            placeholder="e.g., Wheat, Rice, Corn"
            className="input-field"
            required
          />
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Event Date <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Metric Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="w-4 h-4 text-primary" />
            Metric Type <span className="text-destructive">*</span>
          </label>
          <select
            name="metric_name"
            value={formData.metric_name}
            onChange={handleChange}
            className="input-field cursor-pointer bg-background"
            required
          >
            {METRIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Value */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Hash className="w-4 h-4 text-primary" />
            Metric Value <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            name="metric_value"
            value={formData.metric_value}
            onChange={handleChange}
            placeholder="Enter value"
            className="input-field"
            step="any"
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <StickyNote className="w-4 h-4 text-primary" />
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Submit Data
          </span>
        )}
      </button>
    </form>
  );
};

export default DataForm;
