// Utility for managing profile pictures

export const getProfilePicture = (email: string): string | null => {
  const stored = localStorage.getItem(`profilePicture_${email}`);
  return stored;
};

export const setProfilePicture = (email: string, imageData: string): void => {
  localStorage.setItem(`profilePicture_${email}`, imageData);
};

export const removeProfilePicture = (email: string): void => {
  localStorage.removeItem(`profilePicture_${email}`);
};

export const getInitials = (name: string | undefined, email: string | undefined): string => {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'U';
};

export const handleImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  email: string,
  callback?: () => void
): void => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 2MB max
      alert('La taille de l\'image ne doit pas dépasser 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setProfilePicture(email, imageData);
      if (callback) callback();
    };
    reader.readAsDataURL(file);
  }
};
