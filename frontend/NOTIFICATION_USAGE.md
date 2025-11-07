# Notification System Usage Guide

## Overview
The Rentify notification system provides beautiful, animated toast notifications that match the application's UI theme. It replaces all `alert()` calls with a modern, user-friendly notification experience.

## Setup
The notification system is already integrated into your app via `App.js` with the `NotificationProvider` wrapper.

## Usage in Components

### 1. Import the hook
```javascript
import { useNotification } from '../components/NotificationSystem';
```

### 2. Use in your component
```javascript
const MyComponent = () => {
  const { showNotification } = useNotification();
  
  // Your component logic
};
```

### 3. Show notifications
```javascript
showNotification(type, title, message);
```

## Notification Types

### Success
```javascript
showNotification('success', 'Success Title', 'Your action was completed successfully!');
```
- **Use for:** Successful operations, confirmations, completed actions
- **Examples:** Login success, property added, profile updated

### Error
```javascript
showNotification('error', 'Error Title', 'Something went wrong. Please try again.');
```
- **Use for:** Failed operations, validation errors, server errors
- **Examples:** Login failed, network errors, validation failures

### Warning
```javascript
showNotification('warning', 'Warning Title', 'Please be aware of this important information.');
```
- **Use for:** Important notices, potential issues, cautionary messages
- **Examples:** Session expiring, image limit reached, unsaved changes

### Info
```javascript
showNotification('info', 'Info Title', 'Here is some helpful information.');
```
- **Use for:** General information, tips, feature announcements
- **Examples:** Authentication required, coming soon features, helpful tips

## Features

- **Auto-dismiss:** Notifications automatically disappear after 5 seconds
- **Manual close:** Users can click the X button to dismiss immediately
- **Animated:** Epic entry and exit animations with sparkle effects
- **Progress bar:** Visual countdown showing time remaining
- **Theme support:** Automatically adapts to light/dark theme
- **Stacking:** Multiple notifications stack vertically
- **Responsive:** Works on mobile and desktop

## Examples from Your App

### Login Success
```javascript
showNotification('success', 'Login Successful', `Welcome back to Rentify, ${username}!`);
```

### Property Added
```javascript
showNotification('success', 'Property Added Successfully', 'Your property has been listed on Rentify!');
```

### Authentication Required
```javascript
showNotification('info', 'Authentication Required', 'Please log in to browse properties.');
```

### Validation Error
```javascript
showNotification('error', 'Validation Failed', 'Please check your information and try again.');
```

### Image Limit Warning
```javascript
showNotification('warning', 'Image Limit Reached', 'You can upload maximum 10 images');
```

## Migration from alert()

### Before
```javascript
alert('Property added successfully!');
```

### After
```javascript
showNotification('success', 'Property Added', 'Your property has been listed successfully!');
```

## Best Practices

1. **Be specific:** Use clear, descriptive titles and messages
2. **Choose the right type:** Match the notification type to the situation
3. **Keep it short:** Messages should be concise and easy to read
4. **Add delays for navigation:** When redirecting after a notification, add a small delay:
   ```javascript
   showNotification('success', 'Login Successful', 'Welcome back!');
   setTimeout(() => navigate('/dashboard'), 1000);
   ```

## Customization

The notification styles are defined in `NotificationSystem.jsx` and use CSS variables from your theme:
- `--success-color`, `--success-light`, `--success-glow`
- `--error-color`, `--error-light`, `--error-glow`
- `--warning-color`, `--warning-light`, `--warning-glow`
- `--info-color`, `--info-light`, `--info-glow`

These automatically adapt to your light/dark theme settings.
