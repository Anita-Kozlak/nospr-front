export default function ({  $axios, $moment }) {
    const currentDate = $moment().format("YYYY-MM-DD HH:mm")
    const appVersion = localStorage.getItem('app_version')
    if (localStorage.getItem('check_date') === null)localStorage.setItem('check_date',$moment().format("YYYY-MM-DD HH:mm"))
    const checkDate = localStorage.getItem('check_date')
    if (appVersion === null)localStorage.setItem('app_version', '1.27');


    if ($moment(currentDate) > $moment(checkDate)) {
        $axios({
            method: 'get',
            url: 'https://inspektor.nfm.wroclaw.pl/app_version.json',
            responseType: 'application/json'
        })
            .then(function (response) {
                if (response.data.version !== localStorage.getItem('app_version')) {
                    let newDate = $moment().add(5, 'minutes').format("YYYY-MM-DD HH:mm")
                    //Store new date
                    localStorage.setItem("check_date", newDate);
                    //Store new version
                    localStorage.setItem('app_version', response.data.version);
                    //Perform refresh
                    window.location.reload();
                } else {
                    let newDate = $moment().add(5, 'minutes').format("YYYY-MM-DD HH:mm")
                    //Store new date
                    localStorage.setItem("check_date", newDate);
                }
            })
    }
}