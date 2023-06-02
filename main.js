import { styles } from "./asset.js";

let Fake,
  i = 0,
  my_username = "";
  const socket = io(`http://localhost:3000`);
  
class MessageWidget {
  constructor(position = "bottom-right") { 
    this.position = this.getPosition(position);
    this.open = false;
    this.initialize();
    this.injectStyles();
   }

  position = "";
  open = false;
  widgetContainer = null;

  getPosition(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  async initialize() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    Object.keys(this.position).forEach(
      (key) => (container.style[key] = this.position[key])
    );
    document.body.appendChild(container);
    this.widgetContainer = document.createElement("div");
    this.createWidgetContent();
    this.insertMessage();
    this.LoadEventHandlers();
    this.updateScrollbar();
    this.sendmsg();
    this.fakeMessage();
    container.appendChild(this.widgetContainer);
  }

  insertMessage() {
	  const msg = $('.message-input').val();
	  if ($.trim(msg) == '') return false;
	  $('.message-input').val(null);
	  MessageWidget.updateScrollbar();
	  // tell server to execute 'sendchat' and send along one parameter
	  socket.emit('sendchat', msg);
	}

  LoadEventHandlers() {
    Fake = [ 'Hi there, I\'m Wilbert and you?', 'Nice to meet you', 'How are you?', 'Not too bad, thanks', 'What do you do?', 'That\'s awesome', 'Codepen is a nice place to stay', 'I think you\'re a nice person', 'Why do you think that?', 'Can you explain?', 'Anyway I\'ve gotta go now', 'It was a pleasure chat with you', 'Time to make a new codepen', 'Bye', ':)' ]

    $(".chat-title").on("click", () => {
      if ($(".chat").height() == 500)
        $(".chat").animate({ height: 45 }, 1000);
      else $(".chat").animate({ height: 500 }, 1000);

      $(".message-box").slideToggle(300, "swing");
      $(".chat-message-counter").fadeToggle(300, "swing");
    });

    $(".message-submit").click(() => {
      MessageWidget.insertMessage();
    });

    $(window).on("keydown", (e) => {
      if (e.which == 13) {
        MessageWidget.insertMessage();
        return false;
      }
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on("updatechat", (username, data) => {
      if (username == "Chat Bot") {
        $(
          '<div class="message loading new"><figure class="avatar"><img src="/img/sa.png" /></figure><span></span></div>'
        ).appendTo($(".mCSB_container"));
        MessageWidget.updateScrollbar();
        setTimeout(() => {
          $(".message.loading").remove();
          $(
            '<div class="message new"><figure class="avatar"><img src="/img/sa.png" /></figure>' +
              data +
              "</div>"
          )
            .appendTo($(".mCSB_container"))
            .addClass("new");
          MessageWidget.updateScrollbar();
        }, 1000 + Math.random() * 20 * 100);
      } else {
        $(
          '<div class="message loading new"><figure class="avatar"><img src="/public/img/ico-user.png" /></figure><span></span></div>'
        ).appendTo($(".mCSB_container"));
        MessageWidget.updateScrollbar();
        setTimeout(() => {
          $(".message.loading").remove();
          $(
            '<div class="message new"><figure class="avatar"><img src="/public/img/ico-user.png" /></figure>' +
              data +
              "</div>"
          )
            .appendTo($(".mCSB_container"))
            .addClass("new");
          MessageWidget.updateScrollbar();
        }, 1000 + Math.random() * 20 * 100);
      }
    });

    socket.on("store_username", (username) => {
      my_username = username;
    });

    socket.on("msg_user_handle", (from_user, msg) => {
      $(
        '<div class="message loading new"><figure class="avatar"><img src="/public/img/ico-user.png" /></figure><span></span></div>'
      ).appendTo($(".mCSB_container"));
      MessageWidget.updateScrollbar();
      setTimeout(() => {
        $(".message.loading").remove();
        $(
          '<div class="message new"><figure class="avatar"><img src="/public/img/ico-user.png" /></figure>' +
            msg +
            "</div>"
        )
          .appendTo($(".mCSB_container"))
          .addClass("new");
        MessageWidget.updateScrollbar();
      }, 1000 + Math.random() * 20 * 100);
    });

    $(".mCSB_container").on("click", ".message", function () {
      $(this).children("span").toggleClass("menu-options");
    });

    $(".mCSB_container").on("click", ".message .menu-options", function () {
      if ($(this).text() == "Reply") {
        const msg = $(this).closest(".message").text();
        const to_user = $(this)
          .closest(".message")
          .find(".message-username")
          .text();
        $(".message-input").val(`@${to_user} ${msg}`);
      } else if ($(this).text() == "Delete") {
        $(this).closest(".message").remove();
        MessageWidget.updateScrollbar();
      }
    });

    // listener, whenever the server emits 'msg_user_found', this updates the chat body for private messages
    socket.on("msg_user_found", (user) => {
      $(".message-input").attr("placeholder", `Reply to ${user}`);
    });
  }

  updateScrollbar() {
		$('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 10,timeout: 0
		});
	}
	
  sendmsg (id) { 
		socket.emit('check_user', my_username, id);
	}

  fakeMessage() {
		if ($('.message-input').val() != '') return false;
		$('<div class="message loading new"><figure class="avatar"><img src="/img/sa.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
			MessageWidget.updateScrollbar();
			setTimeout( () => {
					$('.message.loading').remove();
					$('<div class="message new"><figure class="avatar"><img src="/img/sa.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
						MessageWidget.setDate();
						MessageWidget.updateScrollbar();
						i++;
			}, 1000 + (Math.random() * 20) * 100);
	}

  injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  createWidgetContent() {
    this.widgetContainer.innerHTML = `
        <div class="chat">
            <div class="chat-title">
                <h1>We are Online</h1>
                <figure class="avatar">
                <img src="/img/sa.png" />
                <span class="chat-message-counter">3</span>
                </figure>
                <span class="online-bullet"></span>
            </div>
            <div class="messages">
                <div class="messages-content"></div>
            </div>
            <div class="message-box">
                <textarea type="text" class="message-input" placeholder="Type message..."></textarea>
                <button type="submit" class="message-submit">Send</button>
            </div>
        </div>
        <div class="bg"></div>
    `;
  }

  

}

function initializeWidget() {
    return new MessageWidget();
  }
  
initializeWidget();