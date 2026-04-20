const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MENTAL_DISORDERS = [
  'ADHD', 'Anxiety Disorder', 'Autism Spectrum Disorder (ASD)',
  'Bipolar Disorder', 'Borderline Personality Disorder (BPD)',
  'Depression', 'Dissociative Identity Disorder (DID)',
  'Eating Disorder', 'Generalized Anxiety Disorder (GAD)',
  'OCD (Obsessive-Compulsive Disorder)', 'PTSD',
  'Panic Disorder', 'Paranoid Personality Disorder',
  'Schizoaffective Disorder', 'Schizophrenia',
  'Social Anxiety Disorder', 'Somatic Symptom Disorder',
  'Substance Use Disorder', 'Narcissistic Personality Disorder (NPD)',
  'Histrionic Personality Disorder', 'Avoidant Personality Disorder',
  'Dependent Personality Disorder', 'Antisocial Personality Disorder',
  'Cyclothymia', 'Dysthymia (Persistent Depressive Disorder)'
];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    default: null
  },
  isUnemployed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  photos: [{
    type: String
  }],
  // Psychographic profile
  parentalScaleResult: {
    type: Number,
    min: 0,
    max: 100,
    default: null
    // 0 = fully mom, 100 = fully dad
  },
  identifiesMoreAs: {
    type: String,
    enum: ['mom', 'dad', null],
    default: null
  },
  visibleWound: {
    type: String,
    enum: ['mom', 'dad', null],
    default: null
  },
  hiddenWound: {
    type: String,
    enum: ['mom', 'dad', null],
    default: null
  },
  mentalDisorders: [{
    type: String,
    enum: MENTAL_DISORDERS
  }],
  // Profile completion
  profileComplete: {
    type: Boolean,
    default: false
  },
  gettingToKnowComplete: {
    type: Boolean,
    default: false
  },
  // Swipe history
  liked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  disliked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  socialLinks: {
    instagram: {
      type: String,
      default: null,
      trim: true,
    },
    whatsapp: {
      type: String,
      default: null,
      trim: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate wound types based on scale
userSchema.methods.calculateWounds = function() {
  if (this.parentalScaleResult === null) return;
  
  if (this.parentalScaleResult <= 50) {
    // Tends to mom
    this.identifiesMoreAs = 'mom';
    this.visibleWound = 'dad';
    this.hiddenWound = 'mom';
  } else {
    // Tends to dad
    this.identifiesMoreAs = 'dad';
    this.visibleWound = 'mom';
    this.hiddenWound = 'dad';
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Indexes for query performance
userSchema.index({ gettingToKnowComplete: 1 });       // recommendations query
userSchema.index({ email: 1 }, { unique: true });      // login lookup (explicit)
userSchema.index({ createdAt: -1 });                   // sorting by newest

module.exports = mongoose.model('User', userSchema);
module.exports.MENTAL_DISORDERS = MENTAL_DISORDERS;
