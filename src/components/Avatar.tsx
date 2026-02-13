import { getProfilePicture, getInitials } from '../utils/profilePicture';

interface AvatarProps {
  email?: string;
  name?: string;
  size?: number;
  editable?: boolean;
  onImageChange?: () => void;
}

const Avatar = ({ email = '', name, size = 40, editable = false, onImageChange }: AvatarProps) => {
  const profilePic = getProfilePicture(email);
  const initials = getInitials(name, email);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        localStorage.setItem(`profilePicture_${email}`, imageData);
        if (onImageChange) onImageChange();
      };
      reader.readAsDataURL(file);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0
  };

  const avatarStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(99, 102, 241, 0.3)',
    display: 'block'
  };

  const initialsStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: `${size * 0.4}px`,
    fontWeight: 700,
    border: '2px solid rgba(99, 102, 241, 0.3)'
  };

  const editButtonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: `${size * 0.3}px`,
    height: `${size * 0.3}px`,
    borderRadius: '50%',
    background: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid var(--bg-primary)',
    fontSize: `${size * 0.15}px`
  };

  return (
    <div style={containerStyle}>
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          style={avatarStyle}
        />
      ) : (
        <div style={initialsStyle}>
          {initials}
        </div>
      )}
      
      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id={`avatar-upload-${email}`}
          />
          <label
            htmlFor={`avatar-upload-${email}`}
            style={editButtonStyle}
          >
            📷
          </label>
        </>
      )}
    </div>
  );
};

export default Avatar;
