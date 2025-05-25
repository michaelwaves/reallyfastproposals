import Emails from "./Emails";

function EmailsPage() {
    return (
        <div>
            <h1 className="text-sky-600 text-2xl text-bold py-2">Emails</h1>
            <p className="text-sky-600 text-lg">Search and view emails</p>
            <Emails />
        </div>
    );
}

export default EmailsPage;