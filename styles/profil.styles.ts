import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#6B7280',
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.15)',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
});
