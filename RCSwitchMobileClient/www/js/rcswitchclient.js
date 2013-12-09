/*
 * RCSwitch Client (c)2013 by Tim 'Octoate' Riemann
 */
            //variable for WebSocket
            var ws;
            var connected = false;
            
            //server address
            var address = '127.0.0.1';
            
            //variables for switch management
            var noOfSwitches = 0;
            var noOfSwitchesKey = 'noOfSwitches';

            $(document).ready(function () {  
                //load server address from webstorage
                address = $.jStorage.get('serviceaddress', '127.0.0.1');
                $("#serviceaddress").val(address);
                
                //add change event to store server address
                $("#serviceaddress").change(onServerAddressChanged);
                
                //generate buttons and bind events
                initialiseButtons();
                  
                //initialise listview on settings page with the buttons
                initialiseSwitchesListview();
                
                //initialise popup event
                initialisePopupEvent();
                
                //update events for the "AddNewSwitch" page
                initialiseNewSwitchEvents();
                
                //open connection to the stored server address
                connect(address);
                
                $("#switches").trigger("create");
            });

            //be sure that the switch text on page "addswitch" is correctly set
            //when the page is initialised
            $(document).delegate("#addswitch", "pageinit", function () {
                updateSwitchText();
            });

            function initialisePopupEvent()
            {
                $("#deleteSwitchPopup").click(function(){
                    removeSwitch($("#switchIndex").val());
                });
            }

            function removeSwitch(swIdx)
            {
                switches = new Array();
                switchesText = new Array();
                
                for (i = 1; i <= noOfSwitches; i++)
                {
                    if (i != swIdx)
                    {
                        //only add elements to arrays if not 'swIdx'
                        switches.push($.jStorage.get(i));
                        switchesText.push($.jStorage.get(i + 'text'));
                    }
                                        
                    //remove elements from data storage
                    $.jStorage.deleteKey(i);
                    $.jStorage.deleteKey(i + 'text');
                }
                
                for (i = 0; i < switches.length; i++)
                {
                    $.jStorage.set(i + 1, switches[i]);
                    $.jStorage.set((i + 1) + 'text', switchesText[i]);
                }
                
                //remove the listview buttons
                removeListviewButtons();
                
                noOfSwitches -= 1;
                $.jStorage.set(noOfSwitchesKey, noOfSwitches);
                
                //update GUI
                updateButtons();
            }

            function removeListviewButtons()
            {
                for (i = 1; i <= noOfSwitches; i++)
                {
                    //remove element from listview on settings page
                    $("#switchNumber" + i).remove();
                }
            }

            function initialiseNewSwitchEvents()
            {
                //bind the buttons
                $("#addNewSwitch").on("click", addNewSwitch);
                
                for (i = 0; i < 5; i++)
                {
                    $("#syscode" + i).on("click", updateSwitchText);
                    $("#unitcode" + i).on("click", updateSwitchText);
                }
            }

            function updateButtons()
            {
                //remove and add switches on home view
                $("#switches").empty();
                initialiseButtons();
                
                //add buttons to listview
                initialiseSwitchesListview();
                $("#settingsListview").listview( "refresh" );
                
                //refresh views
                $('#switches').trigger('create');
                //$('#settings').trigger('create');
            }

            function initialiseSwitchesListview()
            {                  
                noOfSwitches = parseInt($.jStorage.get(noOfSwitchesKey, 0));
                
                //we insert 'before' -> reverse loop
                for (i = noOfSwitches; i > 0; i--)
                {
                    $("#switchList").after(
                        '<li id="switchNumber' + i + '">' +
                            '<a href="#"><div>Name: ' + $.jStorage.get(i + 'text') + ' - Unit Code, System Code: ' + $.jStorage.get(i) + '</div></a>' +
                            '<a href="#removeSwitchPopup" id="removeSwitch' + i + '" data-rel="popup" data-position-to="window" data-transition="pop" data-swidx="' + i + '">Schalter löschen</a>' +
                        '</li>');
                    
                   $("#removeSwitch" + i).click(function(){
                        $("#switchIndex").val($(this).data("swidx"));
                   });
                }
            }

            function initialiseButtons()
            {
                noOfSwitches = parseInt($.jStorage.get(noOfSwitchesKey, 0));
                
                for (i=1; i <= noOfSwitches; i++)
                {
                    $("#switches").append(
                        '<div data-role="controlgroup" data-type="horizontal">' +
                            '<legend>' + $.jStorage.get(i + 'text') + ':</legend>' + 
                            '<button data-icon="plus" id="swon' + i + '">An</button>' +
                            '<button data-icon="minus" id="swoff' + i + '">Aus</button>' +
                        '</div>');
                    
                    //generate the buttons from the webstorage and add the listeners to them
                    buttonCode = $.jStorage.get(i);
                    $("#swon" + i).click({code: buttonCode}, function(event) {
                            switchOn(event.data.code);
                            //alert(event.data.code);
                        });
                    $("#swoff" + i).click({code: buttonCode}, function(event) {
                            switchOff(event.data.code);
                        });
                }
            }

            function addNewSwitch()
            {
                sysCode = '';
                unitCode = '';
                
                for (i = 0; i < 5; i++)
                {
                    sysCode += $("#syscode" + i).is(':checked') ? '1' : '0';
                    unitCode += $("#unitcode" + i).is(':checked') ? '1' : '0';
                }
                
                buttonCode = sysCode + ',' + unitCode;
                                
                //add the new button to the database
                noOfSwitches += 1;
                $.jStorage.set(noOfSwitchesKey, noOfSwitches);
                $.jStorage.set(noOfSwitches, buttonCode);
                $.jStorage.set(noOfSwitches + 'text', $("#switchname").val());
                
                //update the buttons
                removeListviewButtons();
                updateButtons();
            }
            
            function updateSwitchText()
            {
                for (i = 0; i < 5; i++)
                {
                    $("label[for='syscode" + i + "'] span.ui-btn-text").text($("#syscode" + i).is(':checked') ? '1' : '0');
                    $("label[for='unitcode" + i + "'] span.ui-btn-text").text($("#unitcode" + i).is(':checked') ? '1' : '0');
                }
            }

            function onServerAddressChanged()
            {
                address = $("#serviceaddress").val();
                $.jStorage.set('serviceaddress', address);
                connect(address);
            }

            function switchOn(str) {
                if (!connected) {
                    connect(address);
                }
                else {
                    ws.send("1," + str);
                }
            }

            function switchOff(str) {
                if (!connected) {
                    connect(address);
                }
                else {
                    ws.send("0," + str);
                }
            }

            function debug(str) {
                //$("#debug").append("<p>" + str + "<p>");
                window.console.log(str);
            }

            function connect(serviceaddress) {
                if (!serviceaddress)
                {
                    serviceaddress = address;
                }
                
                try
                {
                    window.console.log("Setting up socket");
                    
                    //check if there is already a websocket object and close it 
                    if (ws)
                    {
                        ws.close();
                    }
                    
                    //open a new websocket connection
                    ws = new WebSocket("ws://" + serviceaddress + "/");

                    //register events
                    ws.onmessage = function (evt) {
                        window.console.log("OnMessage:");
                        window.console.log(evt.data);
                    };
                    ws.onerror = function (evt) {
                        window.console.log("OnError:");
                        window.console.log(evt.data);
                    };
                    ws.onclose = function () {
                        window.console.log("onclose called");
                        window.console.log("socket closed");
                        connected = false;
                    };
                    ws.onopen = function () {
                        window.console.log("onopen called");
                        window.console.log("connected...");
                        ws.send("Hello, Arduino");
                        connected = true;
                    };
                } catch (exception) {
                    window.console.log('Error ' + exception);
                }
            }

            function disconnect() {
                connected = false;

                try {
                    window.console.log("Closing socket");
                    ws.close();
                } catch (exception) {
                    window.console.log('Error while closing WebSocket ' + exception);
                }
            }