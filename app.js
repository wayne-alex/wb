const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const allSessionObject = {};
const client = new Client({
    puppeteer: {
        headless: true,
    },
    authStrategy: new LocalAuth({
        clientId: "wayne"
    }),
});

// Define user modes
const modes = {
    MENU: 'menu',
    LOAN_AMOUNT: 'loan_amount',
    LOAN_CONFIRMATION: 'loan_confirmation',
};

// Keep track of user mode in a state object
const userStates = {};

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    // Check if the user's message is a number from 1 to 6
    const chosenOption = parseInt(message.body);
    const currentMode = userStates[message.from];

    if (currentMode === modes.LOAN_AMOUNT) {
        // User is in loan amount mode, process the response
        const loanAmount = parseFloat(message.body);

        if (!isNaN(loanAmount)) {
            // User entered a valid loan amount
            // Transition to the loan confirmation mode
            userStates[message.from] = modes.LOAN_CONFIRMATION;
            const confirmationMessage = `Confirm you want to borrow a loan of KES ${loanAmount}.\n1. Yes\n2. No`;
            client.sendMessage(message.from, confirmationMessage);
        } else {
            // Invalid input, ask for the amount again
            client.sendMessage(message.from, 'Invalid amount. Please enter a valid number.');
        }
    } else if (currentMode === modes.LOAN_CONFIRMATION) {
        // User is in loan confirmation mode
        if (chosenOption === 1) {
            // User confirmed the loan application
            // Perform further processing if needed
            const thankYouMessage = 'Thank you for applying for a loan. Please wait for confirmation from the admin.';
            client.sendMessage(message.from, thankYouMessage);
        } else if (chosenOption === 2) {
            // User canceled the loan application
            const cancelMessage = 'You have successfully cancelled the Loan Application.';
            client.sendMessage(message.from, cancelMessage);
        } else {
            // Invalid option, ask again
            const invalidChoice = 'Invalid choice. Please choose 1 to confirm or 2 to cancel.';
            client.sendMessage(message.from, invalidChoice);
        }

        // Exit the loan confirmation mode and set back to MENU mode
        userStates[message.from] = modes.MENU;
    } else {
        // User is in MENU mode or default mode
        // Check if the user's message is "!menu"
        if (message.body === '!menu') {
            // Reply with the menu options
            const menuOptions = `Hello there, Member! Welcome to Family Bank. Choose an option to continue:
            1. See members
            2. Profit Balance
            3. My Next Round
            4. Account statements
            5. Apply for a loan
            6. Outstanding Loans and statement
            7. Quit`;

            userStates[message.from] = modes.MENU; // Set the user mode to MENU
            client.sendMessage(message.from, menuOptions);
        } else if (chosenOption === 5 && currentMode !== modes.LOAN_AMOUNT) {
            // User chose option 5 and is not already in loan amount mode
            userStates[message.from] = modes.LOAN_AMOUNT; // Set the user mode to LOAN_AMOUNT
            client.sendMessage(message.from, 'Please enter the amount you want to apply for a loan:');
        } else {
            // Respond with a default message for unrecognized commands
            client.sendMessage(message.from, 'To start, type "!menu".');
        }
    }
});

client.initialize();
