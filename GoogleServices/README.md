# Firebase configuration placeholders

1. Duplicate the appropriate `GoogleService-Info.example.plist` file in this directory, rename it to `GoogleService-Info.plist`, and fill in the secrets from your Firebase project.
2. Copy that populated file into `ios/GoogleService-Info.plist` when the iOS build requires it (an example file lives in `ios/`).
3. For Android, duplicate `android/app/google-services.example.json`, rename it to `google-services.json`, and supply the matching credentials.

All real configuration files are ignored by git so they stay out of the public repository.
