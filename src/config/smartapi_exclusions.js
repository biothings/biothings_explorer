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
]
