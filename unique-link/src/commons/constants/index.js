export const API_BASE_URL = 'https://api.surveysparrow.com/v3';

export const HEADER = {
  options: {
    headers: {
      Authorization: 'Bearer <%= iparams.surveysparrow_api_key %>',
    },
  },
};

export const CSV_COLUMN_ORDER = [
  'id',
  'name',
  'email',
  'phone',
  'first_name',
  'last_name',
  'job_title',
  'mobile',
  'active',
  'unsubscribed',
  'unsubscribed_at',
  'createddate',
  'contact_type',
  'uniqueLink',
  'short_url'
]
