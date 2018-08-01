
function getAllUsers()
{
    let link = 'rest/users/';

    AjaxGETRequest(link, showRegisteredUsers);

    function showRegisteredUsers(list)
    {
        let objJSON = JSON.parse(list);
        let tableBody = document.getElementById('users');
        console.log(objJSON);
        tableBody.innerHTML = `
        <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Acciones</th>
        </tr>`;

        objJSON.BODY.forEach(function(element)
        {
            let str = "'"+element.email+"'";
            tableBody.innerHTML += `<tr>
                                        <td>${element.email}</td>
                                        <td>${element.name}</td>
                                        <td>${element.surname}</td>
                                        <td><button onclick="MakeDelete(${str}, 0)">Eliminar usuario</button></td>
                                    </tr>`
        });
    }
}

function checkIfAdmin()
{
    let link = `rest/admin/?email=${sessionStorage.getItem('user')}`;
        
    AjaxGETRequest(link, checkIfTrue);

    function checkIfTrue(response)
    {
        let objJSON = JSON.parse(response);
            if(!objJSON.BODY.EXISTS)
                window.location.replace('index.html');
    }
}

function GenerateRandomPwd()
{    
    let password = Math.random().toString(36).slice(-16);
    console.log(password);
    document.getElementById('pass').value = password;
}

function SendRegisterRequest(form)
{
    AjaxPOSTRequest('rest/register/', form, registerResponse);

    function registerResponse(response)
    {
        let objJSON = JSON.parse(response);
        console.log(objJSON);
        if(objJSON.RESULT == 'OK')
        {
            window.location.replace('index.html');
        }
    }

    return false;
}

function GetAllColumns()
{
    AjaxGETRequest('rest/column/', PresentResult);

	function PresentResult(response)
	{
		let objJSON = JSON.parse(response);
        console.log(objJSON);

        document.getElementById('corpus').innerHTML = `<tr>
        <th>Abreviación</th>
        <th>Nombre del autor</th>
        <th>Apellidos del autor</th>
        <th>Título</th>
        <th>Título general</th>
        <th>Fecha de creación</th>
        <th>Autor de la entrada</th>
        <th>Acciones</th>
        </tr>`
        
        objJSON.BODY.forEach(function(element)
        {
            document.getElementById('corpus').innerHTML += `
                <tr>
                    <td>${element.Abbreviation}</td>
                    <td>${element.Author_Name}</td>
                    <td>${element.Author_surname}</td>
                    <td>${element.Title}</td>
                    <td>${element.gen_title}</td>
                    <td>${element.Dateofcreation}</td>
                    <td>${element.Last_Insert}</td>
                    <td><button onclick="MakeDelete(${element.ID}, 1)">Eliminar entrada</td>
                </tr>
            `;
        });
	}
}

function MakeDelete(id, type)
{
    AjaxGETRequest('rest/delete/?type=' + type + '&id=' + id, IsDeleteOk);

    function IsDeleteOk(response)
    {
        objJSON = JSON.parse(response);
        if(objJSON.BODY.RESULT == 'OK')
        {
            getAllUsers();
            GetAllColumns();
        }
    }
}
