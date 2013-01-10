class ContactMailer < ActionMailer::Base
  default from: "from@example.com",
        to: "matheus.messora.vpn@gmail.com",
      subject: "TESTE"



  def welcome(nome, email)
    logger.info "Enviando email #{nome} - #{email}"

    if email.empty?
      raise BusinessError, "E-mail nao pode ser vazio"
    else
      if email.length <= 5
        raise BusinessError, "E-mail muito curto"
      end

      if !email.include? "@"
        raise BusinessError, "E-mail invalido"
      end
    end

    @name = nome
    mail( :to => "matheus.messora.vpn@gmail.com",
          :from => email)
  end
end
