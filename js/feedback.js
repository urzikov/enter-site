var nodemailer = require('nodemailer');

var transportOptions = {
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: 'informer@kraftit.ru',
            pass: 'Jd89RTup1'
        },
        tls: {
            'rejectUnauthorized': false
        }
    };
var transporter = nodemailer.createTransport(transportOptions);


function getLetterBody (params) {
    var result = 'На сайте СУО Enter размещен запрос на контакт: \n\n';
        result += '  имя: "' + params.name + '"\n';
        result += '  почта: "' + params.mail + '"\n';
        result += '  телефон: "' + params.tel + '"\n';
        result += '  текст: "' + params.text + '"\n';
    return result;
};


/*
    Итеративный повторитель отправки
*/
function tryToSendEmail (params, tryCount, _callback) {
    if (typeof tryCount === 'undefined' || tryCount === null) {
        tryCount = 0;
    }
    var mailOptions = {
        from:    'Информер <informer@kraftit.ru>',
        to:      'a.urzikov@kraftit.ru',
        subject: 'Заявка на сайте Enter',
        text:    getLetterBody(params)
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            if (tryCount < 3) {
                setTimeout(function () {
                    tryToSendEmail(params, tryCount++, _callback);
                }, 5 * 60 * 1000);
            } else {
                console.log('Ошибка отправки. Все попытки завершились неудачно');
                console.log(params);
                console.log(error);
                _callback([]);
            }
        } else {
            _callback(info);
        }
    });
}


function sendForm (req, res) {
    if (req.body.mail || req.body.tel) {
        tryToSendEmail(req.body, 0, function (info) {
            res.send(info);
        });
    } else {
        res.send([]);
    }
};





exports.sendForm = sendForm;