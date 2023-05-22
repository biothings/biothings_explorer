exports.EXCLUDE_LIST = [
    // List of TRAPI APIs to be excluded from cron job update. Used specifically so BTE doesn't retrieve itself
    {
        id: 'dc91716f44207d2e1287c727f281d339',
        name: 'BioThings Explorer (BTE) TRAPI'
    },
    {
        id: '36f82f05705c317bac17ddae3a0ea2f0',
        name: 'Service Provider TRAPI'
    },
    // temp trapi 1.4 instances
    {
        id: '96ee53e4cbc29630dae29762083ba05d',
        name: 'BioThings Explorer (BTE) TRAPI'
    },
    {
        id: '71d5b21590384069eb4534b50a6b71f7',
        name: 'Service Provider TRAPI'
    },
]
