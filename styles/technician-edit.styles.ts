import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.15)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9BA1A6',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
    ...Platform.select({
      ios: {
        paddingVertical: 14,
      },
      android: {
        paddingVertical: 10,
      }
    }),
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    borderRadius: 12,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  inputIcon: {
    marginRight: 8,
  },
  innerInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        paddingVertical: 14,
      },
      android: {
        paddingVertical: 10,
      }
    }),
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  tjmInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
    paddingRight: 16,
  },
  tjmCurrency: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9BA1A6',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
