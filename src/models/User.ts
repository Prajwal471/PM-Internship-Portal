import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age?: number;
  education: {
    level: string; // 'high-school' | '12th' | 'diploma' | 'bachelors' | 'masters' | 'phd'
    field?: string;
    institution?: string;
    year?: number;
  };
  skills: string[]; // Array of skill names
  interestedSectors: string[]; // Array of sector preferences
  location: {
    state: string;
    district?: string;
    pincode?: string;
  };
  language: string; // 'en' | 'hi' | 'regional'
  skillTestCompleted: boolean;
  skillTestScore?: number;
  skillTestAnswers?: Array<{
    question: string;
    answer: string;
    isCorrect: boolean;
  }>;
  testHistory?: Array<{
    date: Date;
    score: number;
    autoSubmitted: boolean;
    reason: string;
    questionsCount: number;
    correctAnswers: number;
  }>;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number },
  education: {
    level: { type: String, required: true },
    field: { type: String },
    institution: { type: String },
    year: { type: Number },
  },
  skills: [{ type: String }],
  interestedSectors: [{ type: String }],
  location: {
    state: { type: String, required: true },
    district: { type: String },
    pincode: { type: String },
  },
  language: { type: String, default: 'en' },
  skillTestCompleted: { type: Boolean, default: false },
  skillTestScore: { type: Number },
  skillTestAnswers: [{
    question: String,
    answer: String,
    isCorrect: Boolean,
  }],
  testHistory: [{
    date: { type: Date, default: Date.now },
    score: { type: Number, required: true },
    autoSubmitted: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    questionsCount: { type: Number, required: true },
    correctAnswers: { type: Number, required: true }
  }],
  profileCompleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);