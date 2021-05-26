export class UsersTable {
  public static users: any = [
    {
      id: 1,
      username: 'sgorianin',
      password: 'admin',
      email: 'sergei.gorianin@ecrin.org',
      accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
      refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
      roles: [1], // Administrator
      pic: './assets/media/svg/avatars/001-boy.svg',
      fullname: 'Sergei Gorianin',
      firstname: 'Sergei',
      lastname: 'Gorianin',
      occupation: 'Data Scientist',
      companyName: 'ECRIN',
      phone: '0663466269',
      language: 'en',
      timeZone: 'CET',
      website: 'https://ecrin.org/',
      emailSettings: {
        emailNotification: true,
        sendCopyToPersonalEmail: false,
        activityRelatesEmail: {
          youHaveNewNotifications: false,
          youAreSentADirectMessage: false,
          someoneAddsYouAsAsAConnection: true,
          uponNewOrder: false,
          newMembershipApproval: false,
          memberRegistration: true
        }
      },
      communication: {
        email: true,
        sms: true,
        phone: false
      },
      address: {
        addressLine: '5 rue Vercingetorix',
        city: 'Paris',
        state: 'Ile-de-France',
        postCode: '75014',
      },
      socialNetworks: {
        linkedIn: 'https://linkedin.com/',
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
      },
    }
  ];

  public static tokens: any = [
    {
      id: 1,
      accessToken: 'access-token-' + Math.random(),
      refreshToken: 'access-token-' + Math.random(),
    },
  ];
}
