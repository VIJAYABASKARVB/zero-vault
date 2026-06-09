const dummyEntries = [
  {
    _id: '1',
    label: 'Gmail',
    username: 'john@gmail.com',
    password: 'Pass123!',
    url: 'gmail.com',
    notes: 'Primary email',
    iv: 'a1b2c3d4e5f6a1b2c3d4e5f6'
  },
  {
    _id: '2',
    label: 'Netflix',
    username: 'john.doe',
    password: 'netflix2024',
    url: 'netflix.com',
    notes: '',
    iv: 'b2c3d4e5f6a1b2c3d4e5f6a1'
  },
  {
    _id: '3',
    label: 'Chase Bank',
    username: 'johndoe',
    password: 'BankPass!456',
    url: 'chase.com',
    notes: 'Checking account',
    iv: 'c3d4e5f6a1b2c3d4e5f6a1b2'
  },
  {
    _id: '4',
    label: 'GitHub',
    username: 'johndoe',
    password: 'gh_token_abc',
    url: 'github.com',
    notes: '',
    iv: 'd4e5f6a1b2c3d4e5f6a1b2c3'
  },
  {
    _id: '5',
    label: 'Spotify',
    username: 'john@gmail.com',
    password: 'music123',
    url: 'spotify.com',
    notes: 'Family plan',
    iv: 'e5f6a1b2c3d4e5f6a1b2c3d4'
  },
  {
    _id: '6',
    label: 'AWS Console',
    username: 'john.admin',
    password: 'Aws!Admin#789',
    url: 'aws.amazon.com',
    notes: 'Root account',
    iv: 'f6a1b2c3d4e5f6a1b2c3d4e5'
  },
  {
    _id: '7',
    label: 'Instagram',
    username: '@johndoe',
    password: 'insta_pass',
    url: 'instagram.com',
    notes: '',
    iv: 'a1b2c3d4e5f6a1b2c3d4e5f7'
  },
  {
    _id: '8',
    label: 'Work Email',
    username: 'john@company.com',
    password: 'WorkPass!2024',
    url: 'outlook.office.com',
    notes: 'Office 365',
    iv: 'b2c3d4e5f6a1b2c3d4e5f6a8'
  }
]

export default dummyEntries;