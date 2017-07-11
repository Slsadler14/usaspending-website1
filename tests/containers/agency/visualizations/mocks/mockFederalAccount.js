export const mockAccount = {
    page_metadata: {
        page: 1,
        has_next_page: true,
        has_previous_page: false,
        previous: null
    },
    req: "abc",
    results: [{
        id: "1503",
        agency_name: "Federal Trade Commission",
        account_title: "Salaries and Expenses, Federal Trade Commission",
        obligated_amount: "138550594.48"
    },
    {
        id: "555",
        agency_name: "Federal Trade Commission",
        account_title: "Second Account",
        obligated_amount: "123"
    }]
};

export const parsedSeries = {
    dataSeries: [138550594.48, 123],
    labelSeries: ['Salaries and Expenses, Federal Trade Commission', 'Second Account'],
    linkSeries: ['1503', '555']
};
