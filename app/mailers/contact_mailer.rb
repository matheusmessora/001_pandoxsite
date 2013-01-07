class ContactMailer < ActionMailer::Base
  default from: "from@example.com",
  				to: "matheus.messora.vpn@gmail.com",
  				subject: "TESTE"



  def welcome(nome)
  	mail(:to => "matheus.messora.vpn@gmail.com") do |format|
  		format.text { render :text => "Hello Mikel!" }
		  format.html { render :text => "<h1>Hello Mikel!</h1>" }
		end
  end
end
