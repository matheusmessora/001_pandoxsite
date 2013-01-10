class ContactMailer < ActionMailer::Base
  default from: "from@example.com",
        to: "matheus.messora.vpn@gmail.com",
      subject: "TESTE"



  def welcome(nome, email)
    logger.info "Enviando email #{nome} - #{email}"
    @name = nome
    mail( :to => "matheus.messora.vpn@gmail.com",
          :from => email)
  end
end
